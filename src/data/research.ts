import type { ResearchProject } from "../types/content";

export const nlpResearch: ResearchProject = {
  slug: "nlp-intent-classification",
  title:
    "Comparative Analysis of NLP Intent Classification in Indonesian Customer Service Chatbots",
  venue: "ICIMTech 2026",
  status: "Published",
  year: "2026",
  summary:
    "A controlled benchmark of five intent-classification approaches on 5,995 Indonesian customer-service queries — comparing accuracy, inference speed, and robustness to noisy, informal language.",
  authors: [
    { name: "Austin Yang" },
    { name: "Hansel Kristanzen Siswanto", isMe: true },
    { name: "Nikita Ananda Putri Masaling" },
    { name: "Edy Irwansyah" },
  ],
  dataset: {
    size: 5995,
    intentCategories: 11,
    language: "Indonesian",
    domains: ["E-commerce", "Banking", "Telecommunications", "Education"],
    characteristics: [
      "Formal & informal language",
      "Abbreviations & slang",
      "Typos",
      "Indonesian–English code-mixing",
    ],
  },
  models: [
    {
      id: "rule-based",
      name: "Rule-Based Matching",
      shortName: "Rule-Based",
      methodology: "Hand-written regular-expression and keyword patterns built from the training set.",
      accuracy: 38.44,
      latencyMs: 0.01,
      robustnessDropPp: 9.56,
      note: "Fastest technique by a wide margin, but with no semantic understanding — mainly useful as a sanity baseline or first-pass filter.",
    },
    {
      id: "fuzzy",
      name: "Fuzzy String Matching",
      shortName: "Fuzzy Matching",
      methodology: "RapidFuzz token-set ratio against canonical template queries per intent.",
      accuracy: 62.44,
      latencyMs: 0.4,
      robustnessDropPp: 3.67,
    },
    {
      id: "tfidf-svm",
      name: "TF-IDF + Linear SVM",
      shortName: "TF-IDF · SVM",
      methodology: "TF-IDF vectorization (unigrams + bigrams) feeding a linear support vector classifier.",
      accuracy: 99.78,
      latencyMs: 0.57,
      robustnessDropPp: 5.11,
      note: "Best accuracy/speed/robustness trade-off in the study — especially for CPU-only deployment.",
    },
    {
      id: "word2vec-mlp",
      name: "Word2Vec + MLP",
      shortName: "Word2Vec · MLP",
      methodology: "Word2Vec embeddings averaged per query, classified by a one-hidden-layer MLP.",
      accuracy: 97.89,
      latencyMs: 0.48,
      robustnessDropPp: 10.22,
    },
    {
      id: "indobert",
      name: "IndoBERT",
      shortName: "IndoBERT",
      methodology: "Fine-tuned IndoBERT-base-p1 transformer, end to end, with a classification head.",
      accuracy: 100.0,
      latencyMs: 18.77,
      robustnessDropPp: 7.56,
      note: "Highest clean accuracy, but ~33× slower per query than TF-IDF + SVM and not the most noise-robust.",
    },
  ],
  limitation:
    "The benchmark demonstrates controlled model performance, not production-level generalization. Because the dataset is synthetic and FAQ-template based, real-world performance on unscripted, out-of-distribution traffic is expected to be lower than these clean-set numbers.",
};
