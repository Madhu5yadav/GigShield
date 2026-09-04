import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

class RealLocalRAG:
    """
    Production-Grade Local Semantic RAG Pipeline.
    Uses Hugging Face Sentence Transformers + FAISS vector search 
    to retrieve RBI compliance and KFS policy context locally on CPU.
    """
    def __init__(self, policy_file="rbi_policy.txt", model_name="all-MiniLM-L6-v2"):
        print(f"[RAG] Loading local embedding model ({model_name})...")
        self.encoder = SentenceTransformer(model_name)
        self.chunks = []
        self.index = None
        self._initialize_vector_db(policy_file)

    def _initialize_vector_db(self, filepath):
        if not os.path.exists(filepath):
            # Fallback text if file is missing
            raw_text = [
                "RBI mandates that every digital micro-credit advance must show a transparent Key Fact Statement (KFS) with an absolute ₹10 convenience fee.",
                "The Account Aggregator (AA) framework allows encrypted, consent-based banking telemetry sharing under the DPDP Act.",
                "OCEN 4.0 standards enable automated source-deduction via UPI AutoPay to eliminate default risk for institutional lenders."
            ]
        else:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            # Split chunks by brackets
            raw_text = [c.strip() for c in content.split("[DOC_") if c.strip()]
            raw_text = [("[DOC_" + c) for c in raw_text]

        self.chunks = raw_text
        
        # Generate dense vector embeddings
        print("[RAG] Generating local vector embeddings...")
        embeddings = self.encoder.encode(self.chunks, show_progress_bar=False)
        embeddings = np.array(embeddings).astype("float32")

        # Build FAISS Flat L2 Vector Index
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(embeddings)
        print(f"[OK] FAISS Vector DB successfully indexed {len(self.chunks)} compliance documents.")

    def query(self, user_query, top_k=1):
        """Performs semantic similarity search to retrieve the most relevant policy chunk."""
        if not self.chunks or self.index is None:
            return {"error": "Vector database uninitialized."}

        # Embed user question
        q_vector = self.encoder.encode([user_query]).astype("float32")
        
        # Search FAISS index
        distances, indices = self.index.search(q_vector, top_k)
        
        retrieved_snippets = []
        for idx in indices[0]:
            if idx < len(self.chunks):
                snippet = self.chunks[idx]
                # Strip bracket headers like [DOC_1]
                if "]" in snippet:
                    snippet = snippet.split("]", 1)[-1].strip()
                retrieved_snippets.append(snippet)

        matched_text = retrieved_snippets[0] if retrieved_snippets else "No matching policy rule found."
        
        return {
            "query": user_query,
            "retrieved_context": matched_text,
            "ai_explanation": f"Grounded RBI & AURA Policy: {matched_text}"
        }

if __name__ == "__main__":
    rag = RealLocalRAG()
    res = rag.query("Why do we need a Key Fact Statement?")
    import json
    print(json.dumps(res, indent=2))