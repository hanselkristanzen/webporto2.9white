import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import styles from "./ImageLightbox.module.css";

interface LightboxImage {
  src: string;
  alt: string;
  /** Fractional viewport position (0–1) the image should visually grow from. */
  originX?: number;
  originY?: number;
}

interface ImageLightboxContextValue {
  openImage: (image: LightboxImage) => void;
}

const ImageLightboxContext = createContext<ImageLightboxContextValue>({
  openImage: () => {},
});

/** Lets any component open the shared image lightbox: `openImage({ src, alt })`. */
export function useImageLightbox(): ImageLightboxContextValue {
  return useContext(ImageLightboxContext);
}

const CLOSE_TRANSITION_MS = 320;

export function ImageLightboxProvider({ children }: { children: ReactNode }) {
  const [renderedImage, setRenderedImage] = useState<LightboxImage | null>(null);
  const [visible, setVisible] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const openFrameRef = useRef<number | null>(null);

  const openImage = useCallback((image: LightboxImage) => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    setRenderedImage(image);
    // Mount first with visible=false, then flip it on the next frame so the
    // opacity/scale transition actually has a "from" state to animate from.
    openFrameRef.current = window.requestAnimationFrame(() => setVisible(true));
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    previouslyFocusedRef.current?.focus?.();
    closeTimeoutRef.current = window.setTimeout(() => {
      setRenderedImage(null);
    }, CLOSE_TRANSITION_MS);
  }, []);

  useEffect(() => {
    if (!renderedImage) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);

    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      window.cancelAnimationFrame(focusFrame);
    };
  }, [renderedImage, close]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
      if (openFrameRef.current) window.cancelAnimationFrame(openFrameRef.current);
    };
  }, []);

  const value = useMemo(() => ({ openImage }), [openImage]);

  return (
    <ImageLightboxContext.Provider value={value}>
      {children}
      {typeof document !== "undefined"
        ? createPortal(
            <div
              className={styles.overlay}
              data-open={visible}
              role="dialog"
              aria-modal="true"
              aria-label={renderedImage?.alt || "Image preview"}
              onClick={(event) => {
                if (event.target === event.currentTarget) close();
              }}
            >
              {renderedImage ? (
                <>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    className={`${styles.close} cursor-target`}
                    onClick={close}
                    aria-label="Close image preview"
                  >
                    Close
                    <span aria-hidden="true">×</span>
                  </button>
                  {/* The backdrop (this overlay's own background) carries the
                      blur/dim — the image itself has no filter applied, so
                      it stays completely sharp while everything behind it
                      recedes (TASK 6). */}
                  <img
                    src={renderedImage.src}
                    alt={renderedImage.alt}
                    className={styles.image}
                    style={
                      renderedImage.originX !== undefined && renderedImage.originY !== undefined
                        ? ({
                            "--lightbox-origin-x": `${renderedImage.originX * 100}%`,
                            "--lightbox-origin-y": `${renderedImage.originY * 100}%`,
                          } as CSSProperties)
                        : undefined
                    }
                  />
                </>
              ) : null}
            </div>,
            document.body
          )
        : null}
    </ImageLightboxContext.Provider>
  );
}
