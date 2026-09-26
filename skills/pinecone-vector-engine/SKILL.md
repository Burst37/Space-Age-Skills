---  
name: pinecone-vector-engine  
version: 2.0.0  
trigger: pinecone | vector database | vector search | semantic search | RAG | retrieval augmented generation | embeddings | index | upsert | /pinecone | /query | /assistant | /index | vector store | similarity search | namespace | rerank | hybrid search | knowledge retrieval | AI memory | long-term memory | document Q\&A | embedding pipeline  
description: >  
 Universal Pinecone vector database skill. Covers index creation and management,  
 record upsert workflows, semantic query with filtering and reranking, Pinecone  
 Assistants (managed RAG), MCP server integration, CLI operations, hybrid  
 sparse+dense search, namespace strategy, and production RAG pipeline  
 architecture. Client-agnostic — applies to any domain, any client, any  
 knowledge retrieval use case. Synthesized from pinecone-io/pinecone-claude-code-plugin  
 (official, v1.3.0), Orchestra-Research AI-Research-SKILLs Pinecone skill (410 lines),  
 and applied-ai/claude-code-toolkit RAG implementation.  
author: Space Age AI Solutions  
sources:  
 - https://github.com/pinecone-io/pinecone-claude-code-plugin  
 - https://github.com/Orchestra-Research/AI-research-SKILLs  
 - https://github.com/applied-artificial-intelligence/claude-code-toolkit  
 - https://docs.pinecone.io  
tags: [pinecone, vector-database, RAG, semantic-search, embeddings, AI-memory, universal]  
---  
  
# Pinecone Vector Engine  
  
## WHEN TO ACTIVATE  
  
Load this skill when the user:  
- Mentions Pinecone, vector database, vector search, or semantic search  
- Needs to build RAG (Retrieval Augmented Generation) systems  
- Wants to add long-term memory or knowledge retrieval to any AI project  
- Is building a document Q\&A system or AI assistant for any client  
- Asks about embeddings, similarity search, or chunking strategies  
- References `/pinecone`, `/query`, `/assistant`, or index management  
- Needs to connect any knowledge source to an AI agent  
- Is building any product that requires context beyond the model's context window  
  
---  
  
## MODULE 1 — ENVIRONMENT SETUP  
  
```bash  
# Install  
pip install pinecone  
  
# Environment  
export PINECONE_API_KEY="your-api-key"  
  
# Verify  
python3 -c "from pinecone import Pinecone; pc = Pinecone(); print(pc.list_indexes())"  
  
# Pinecone CLI (optional)  
brew tap pinecone-io/tap && brew install pinecone-io/tap/pinecone  
pc login  
  
# uv — required for Pinecone Assistant commands  
curl -LsSf https://astral.sh/uv/install.sh | sh  
```  
  
---  
  
## MODULE 2 — INDEX ARCHITECTURE  
  
### Index Type Decision Matrix  
  
| Type | Use Case | Embedding Source | Latency | Best For |  
|------|----------|-----------------|---------|----------|  
| **Serverless** | Auto-scaling, cost-efficient | External (OpenAI etc.) | <100ms | Production apps, variable load |  
| **Integrated (Serverless)** | Managed RAG, fast setup | Pinecone hosted models | <100ms | Assistants, quick deploys |  
| **Pod-based** | High-throughput, predictable | External | <50ms | Enterprise, consistent load |  
  
### Create Index  
  
```python  
from pinecone import Pinecone, ServerlessSpec  
import os, time  
  
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))  
  
# Serverless (recommended for most use cases)  
pc.create_index(  
 name="my-knowledge-base",  
 dimension=1536, # Must match embedding model output  
 metric="cosine", # cosine | dotproduct | euclidean  
 spec=ServerlessSpec(  
 cloud="aws",  
 region="us-east-1"  
 )  
)  
  
# Wait for readiness  
while not pc.describe_index("my-knowledge-base").status["ready"]:  
 time.sleep(1)  
print("Index ready.")  
  
# Connect to existing index  
index = pc.Index("my-knowledge-base")  
```  
  
### Naming Conventions  
  
```  
# By project scope  
{project-slug}-knowledge → General project knowledge  
{project-slug}-docs → Documentation only  
{project-slug}-assistant → Managed Pinecone Assistant  
  
# By domain  
{domain}-{client-slug} → Domain-specific per client  
research-{topic} → Research knowledge bases  
```  
  
### Metric Selection  
  
| Metric | When to Use |  
|--------|-------------|  
| `cosine` | Most text embeddings (normalized vectors) — default |  
| `dotproduct` | Maximum inner product (recommendation systems) |  
| `euclidean` | When geometric distance matters (rare for NLP) |  
  
---  
  
## MODULE 3 — EMBEDDINGS  
  
### Model Selection  
  
```python  
from openai import OpenAI  
  
client = OpenAI()  
  
# Single embedding  
def embed(text: str, model: str = "text-embedding-3-small") -> list[float]:  
 return client.embeddings.create(  
 input=text, model=model  
 ).data[0].embedding  
  
# Batch embedding (efficient — one API call)  
def embed_batch(texts: list[str], model: str = "text-embedding-3-small") -> list[list[float]]:  
 response = client.embeddings.create(input=texts, model=model)  
 return [item.embedding for item in response.data]  
  
# Free local embeddings (Sentence Transformers)  
from sentence_transformers import SentenceTransformer  
st_model = SentenceTransformer("all-mpnet-base-v2") # 768 dims  
embeddings = st_model.encode(texts, batch_size=32)  
```  
  
### Embedding Model Reference  
  
| Model | Dims | Notes |  
|-------|------|-------|  
| `text-embedding-3-small` | 1536 | Best cost/quality — recommended default |  
| `text-embedding-3-large` | 3072 | Max quality, higher cost |  
| `text-embedding-ada-002` | 1536 | Legacy OpenAI |  
| `all-mpnet-base-v2` | 768 | Free, strong local performance |  
| `all-MiniLM-L6-v2` | 384 | Free, fastest local |  
  
> ⚠️ Dimension must match at index creation time. Mixing model versions in one index produces meaningless similarity scores.  
  
---  
  
## MODULE 4 — CHUNKING STRATEGIES  
  
```python  
from langchain.text_splitter import RecursiveCharacterTextSplitter  
  
# Standard (good default for most documents)  
splitter = RecursiveCharacterTextSplitter(  
 chunk_size=500,  
 chunk_overlap=50,  
 separators=["\\n\\n", "\\n", " ", ""]  
)  
  
# Large chunks (for summaries, high-level context)  
large_splitter = RecursiveCharacterTextSplitter(  
 chunk_size=2000,  
 chunk_overlap=200  
)  
  
# Sliding window (highest quality, critical retrieval)  
sliding_splitter = RecursiveCharacterTextSplitter(  
 chunk_size=500,  
 chunk_overlap=250 # 50% overlap  
)  
```  
  
### Chunking Strategy Decision Tree  
  
```  
Document type?  
├── Structured (articles, docs, books)  
│ └── Recursive character splitter, chunk_size=500, overlap=50  
├── Unstructured (chat logs, transcripts)  
│ └── Fixed-size, chunk_size=300, overlap=30  
└── Mixed → Semantic chunking (split on headings first)  
  
Quality requirement?  
├── Critical → Sliding window (overlap=50%)  
├── Standard → Recursive (overlap=10–20%)  
└── Fast/cheap → Fixed-size (overlap=10%)  
  
Document has clear sections (headings)?  
└── Yes → Split by heading first, then chunk each section  
```  
  
### Generic Document Chunker  
  
```python  
import re, glob, yaml  
  
def chunk_document(text: str, source_id: str, metadata: dict = {}) -> list[dict]:  
 chunks = splitter.split_text(text)  
 return [{  
 "id": f"{source_id}#{i}",  
 "text": chunk,  
 "metadata": {  
 **metadata,  
 "source_id": source_id,  
 "chunk_index": i,  
 "total_chunks": len(chunks),  
 }  
 } for i, chunk in enumerate(chunks)]  
  
def chunk_markdown_by_sections(text: str, source_id: str, metadata: dict = {}) -> list[dict]:  
 """Respects heading structure before chunking."""  
 sections = re.split(r"\\n(?=#{1,3} )", text)  
 chunks = []  
 for section in sections:  
 heading_match = re.match(r"(#{1,3} .+)", section)  
 heading = heading_match.group(1) if heading_match else ""  
 sub_chunks = splitter.split_text(section)  
 for i, chunk in enumerate(sub_chunks):  
 chunks.append({  
 "id": f"{source_id}#{len(chunks)}",  
 "text": chunk,  
 "metadata": {  
 **metadata,  
 "source_id": source_id,  
 "section": heading,  
 "chunk_index": i,  
 }  
 })  
 return chunks  
```  
  
---  
  
## MODULE 5 — UPSERT OPERATIONS  
  
```python  
from pinecone import Pinecone  
import os  
  
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))  
index = pc.Index("my-knowledge-base")  
  
# Single record  
index.upsert(  
 vectors=[{  
 "id": "doc-001-chunk-0",  
 "values": embedding_vector,  
 "metadata": {  
 "text": "Chunk text (max 40KB)",  
 "source": "filename.md",  
 "title": "Document Title",  
 "type": "article",  
 "date": "2026-05-03",  
 "tags": ["topic", "domain"],  
 "chunk_index": 0,  
 "total_chunks": 5,  
 }  
 }],  
 namespace="documents"  
)  
  
# Batch upsert (max 100 vectors per call)  
def upsert_batch(index, vectors: list[dict], namespace: str, batch_size: int = 100):  
 for i in range(0, len(vectors), batch_size):  
 batch = vectors[i:i + batch_size]  
 index.upsert(vectors=batch, namespace=namespace)  
 print(f"Upserted {len(vectors)} vectors → namespace '{namespace}'")  
  
# Full document pipeline  
def index_document(filepath: str, namespace: str = "default", extra_metadata: dict = {}):  
 with open(filepath) as f:  
 text = f.read()  
  
 chunks = chunk_document(text, source_id=filepath, metadata={  
 "source": filepath,  
 **extra_metadata  
 })  
 embeddings = embed_batch([c["text"] for c in chunks])  
  
 vectors = [{  
 "id": c["id"],  
 "values": emb,  
 "metadata": c["metadata"]  
 } for c, emb in zip(chunks, embeddings)]  
  
 upsert_batch(index, vectors, namespace)  
 print(f"Indexed: {filepath} ({len(vectors)} chunks)")  
  
# Delete operations  
index.delete(ids=["doc-001-chunk-0"], namespace="documents")  
index.delete(filter={"type": {"$eq": "outdated"}}, namespace="documents")  
index.delete(delete_all=True, namespace="old-namespace")  
```  
  
---  
  
## MODULE 6 — QUERY & RETRIEVAL  
  
```python  
from pinecone import Pinecone  
from openai import OpenAI  
import os  
  
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))  
openai = OpenAI()  
index = pc.Index("my-knowledge-base")  
  
# Basic semantic query  
def query(question: str, namespace: str = "", top_k: int = 5) -> list:  
 q_emb = embed(question)  
 results = index.query(  
 vector=q_emb,  
 top_k=top_k,  
 namespace=namespace,  
 include_metadata=True,  
 )  
 return results.matches  
  
# Query with metadata filtering  
def query_filtered(question: str, filters: dict, top_k: int = 10) -> list:  
 q_emb = embed(question)  
 return index.query(  
 vector=q_emb,  
 top_k=top_k,  
 filter=filters,  
 include_metadata=True,  
 ).matches  
  
# Filter operator reference  
"""  
{"field": {"$eq": "value"}} # equals  
{"field": {"$ne": "value"}} # not equal  
{"field": {"$gt": 5}} # greater than  
{"field": {"$gte": 5}} # greater than or equal  
{"field": {"$lt": 5}} # less than  
{"tags": {"$in": ["a", "b"]}} # array: contains any  
{"tags": {"$nin": ["x", "y"]}} # array: contains none  
{"$and": [{...}, {...}]} # logical AND  
{"$or": [{...}, {...}]} # logical OR  
"""  
  
# Query with reranking  
def query_with_rerank(question: str, namespace: str = "", top_k: int = 5) -> list:  
 q_emb = embed(question)  
 # Fetch more candidates for reranker to work with  
 candidates = index.query(  
 vector=q_emb,  
 top_k=top_k * 4,  
 namespace=namespace,  
 include_metadata=True,  
 ).matches  
  
 if not candidates:  
 return []  
  
 reranked = pc.inference.rerank(  
 model="bge-reranker-v2-m3",  
 query=question,  
 documents=[m.metadata.get("text", "") for m in candidates],  
 top_n=top_k,  
 )  
 return [candidates[r.index] for r in reranked.data]  
```  
  
---  
  
## MODULE 7 — HYBRID SEARCH (Sparse + Dense)  
  
Combines BM25 keyword matching with semantic vector similarity for best-of-both retrieval.  
  
```python  
from pinecone_text.sparse import BM25Encoder  
  
# One-time: fit BM25 on your corpus  
bm25 = BM25Encoder()  
bm25.fit(all_document_texts) # Must run before indexing  
bm25.dump("bm25_params.json") # Save params for reuse  
  
# Load saved params  
bm25 = BM25Encoder()  
bm25.load("bm25_params.json")  
  
# Upsert with sparse + dense  
index.upsert(vectors=[{  
 "id": "doc-001",  
 "values": dense_embedding,  
 "sparse_values": bm25.encode_documents([text])[0],  
 "metadata": {"text": text, "source": "file.md"}  
}])  
  
# Hybrid query — alpha controls blend  
def hybrid_query(query: str, alpha: float = 0.75, top_k: int = 10) -> list:  
 """  
 alpha=1.0 → pure dense (semantic)  
 alpha=0.0 → pure sparse (keyword)  
 alpha=0.75 → recommended default for RAG  
 """  
 q_dense = embed(query)  
 q_sparse = bm25.encode_queries([query])[0]  
  
 dense_scaled = [v * alpha for v in q_dense]  
 sparse_scaled = {  
 "indices": q_sparse["indices"],  
 "values": [v * (1 - alpha) for v in q_sparse["values"]]  
 }  
  
 return index.query(  
 vector=dense_scaled,  
 sparse_vector=sparse_scaled,  
 top_k=top_k,  
 include_metadata=True,  
 ).matches  
```  
  
---  
  
## MODULE 8 — PINECONE ASSISTANT (Managed RAG)  
  
Fully managed document Q\&A — no embedding pipeline required.  
  
```python  
from pinecone import Pinecone  
from pinecone_plugins.assistant.models.chat import Message  
import os  
  
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))  
  
# Create assistant  
assistant = pc.assistant.create_assistant(  
 assistant_name="my-assistant",  
 instructions="""  
 You are a helpful assistant.  
 Answer questions based ONLY on the provided documents.  
 If the documents don't contain the answer, say so clearly.  
 Always cite the source document.  
 """,  
 metadata={"project": "my-project", "version": "1.0"}  
)  
  
# Upload documents  
asst = pc.assistant.Assistant(assistant_name="my-assistant")  
asst.upload_file(file_path="docs/document.pdf", timeout=None)  
asst.upload_file(file_path="docs/reference.md")  
  
# Bulk upload folder  
import os  
def upload_folder(assistant_name: str, folder: str, extensions=(".pdf", ".md", ".txt", ".docx")):  
 asst = pc.assistant.Assistant(assistant_name=assistant_name)  
 for filename in os.listdir(folder):  
 if filename.endswith(extensions):  
 asst.upload_file(file_path=f"{folder}/{filename}")  
 print(f"Uploaded: {filename}")  
  
# Chat  
response = asst.chat(messages=[  
 Message(role="user", content="What does the document say about pricing?")  
])  
print(response.message.content)  
  
# Context retrieval (for custom UI)  
context = asst.retrieve(query="pricing information", top_k=5)  
for snippet in context.snippets:  
 print(f"Source: {snippet.reference.file.name}")  
 print(snippet.content[:300])  
  
# Sync folder (add new, remove deleted)  
def sync_assistant(assistant_name: str, docs_folder: str):  
 asst = pc.assistant.Assistant(assistant_name=assistant_name)  
 existing = {f.name: f.id for f in asst.list_files()}  
 local_files = set(os.listdir(docs_folder))  
  
 for name, fid in existing.items():  
 if name not in local_files:  
 asst.delete_file(file_id=fid)  
 print(f"Deleted: {name}")  
  
 for filename in local_files:  
 if filename not in existing:  
 asst.upload_file(file_path=f"{docs_folder}/{filename}")  
 print(f"Added: {filename}")  
  
# List all files  
for f in asst.list_files():  
 print(f"{f.name} | Status: {f.status}")  
```  
  
---  
  
## MODULE 9 — MCP SERVER INTEGRATION  
  
Direct Pinecone tool access inside Claude Code and compatible agents.  
  
```json  
// .mcp.json  
{  
 "mcpServers": {  
 "pinecone": {  
 "command": "npx",  
 "args": ["-y", "@pinecone-io/mcp-pinecone"],  
 "env": {  
 "PINECONE_API_KEY": "${PINECONE_API_KEY}"  
 }  
 }  
 }  
}  
```  
  
### MCP Tool Reference  
  
| Tool | Parameters | Description |  
|------|-----------|-------------|  
| `list-indexes` | — | List all indexes |  
| `describe-index` | `indexName` | Config + namespaces |  
| `describe-index-stats` | `indexName` | Record counts per namespace |  
| `search-records` | `indexName`, `query`, `namespace?`, `topK?`, `filter?`, `reranker?` | Semantic search |  
| `create-index-for-model` | `indexName`, `model`, `cloud`, `region` | Create integrated index |  
| `upsert-records` | `indexName`, `records[]`, `namespace?` | Insert/update records |  
| `rerank-documents` | `query`, `documents[]`, `model`, `topN` | Cross-encoder rerank |  
  
**Natural language usage in Claude Code:**  
```  
"List all my Pinecone indexes"  
"Search my-knowledge-base for 'authentication flow' in the docs namespace"  
"How many records are in each namespace of my-index?"  
"Create an integrated index called product-search"  
```  
  
---  
  
## MODULE 10 — PRODUCTION RAG PIPELINE  
  
Drop-in RAG class — configure once, use across any client project.  
  
```python  
import os  
from openai import OpenAI  
from pinecone import Pinecone  
from langchain.text_splitter import RecursiveCharacterTextSplitter  
  
class RAGPipeline:  
 """  
 Production RAG pipeline.  
 Multi-tenant via namespaces.  
 Supports ingestion, retrieval, hybrid search, and grounded generation.  
 """  
  
 def __init__(  
 self,  
 index_name: str,  
 namespace: str = "default",  
 embedding_model: str = "text-embedding-3-small",  
 chat_model: str = "gpt-4o-mini",  
 chunk_size: int = 500,  
 chunk_overlap: int = 50,  
 similarity_threshold: float = 0.7,  
 ):  
 self.pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))  
 self.openai = OpenAI()  
 self.index = self.pc.Index(index_name)  
 self.namespace = namespace  
 self.embedding_model = embedding_model  
 self.chat_model = chat_model  
 self.threshold = similarity_threshold  
 self.splitter = RecursiveCharacterTextSplitter(  
 chunk_size=chunk_size,  
 chunk_overlap=chunk_overlap,  
 )  
  
 def _embed(self, texts: list[str]) -> list[list[float]]:  
 response = self.openai.embeddings.create(  
 input=texts, model=self.embedding_model  
 )  
 return [item.embedding for item in response.data]  
  
 def ingest(self, documents: list[dict], batch_size: int = 100):  
 """  
 documents: [{"id": str, "text": str, "metadata": dict}]  
 """  
 vectors = []  
 for doc in documents:  
 chunks = self.splitter.split_text(doc["text"])  
 embeddings = self._embed(chunks)  
 for i, (chunk, emb) in enumerate(zip(chunks, embeddings)):  
 vectors.append({  
 "id": f"{doc['id']}#{i}",  
 "values": emb,  
 "metadata": {  
 **doc.get("metadata", {}),  
 "text": chunk[:500],  
 "source_id": doc["id"],  
 "chunk_index": i,  
 }  
 })  
  
 for i in range(0, len(vectors), batch_size):  
 self.index.upsert(  
 vectors=vectors[i:i + batch_size],  
 namespace=self.namespace  
 )  
 print(f"Ingested {len(documents)} docs → {len(vectors)} chunks → namespace '{self.namespace}'")  
  
 def retrieve(self, query: str, top_k: int = 5, filters: dict = None) -> list[str]:  
 q_emb = self._embed([query])[0]  
 results = self.index.query(  
 vector=q_emb,  
 top_k=top_k,  
 namespace=self.namespace,  
 filter=filters,  
 include_metadata=True,  
 )  
 return [  
 f"[{m.metadata.get('source_id', 'unknown')}]\\n{m.metadata.get('text', '')}"  
 for m in results.matches  
 if m.score >= self.threshold  
 ]  
  
 def answer(  
 self,  
 question: str,  
 system_prompt: str = None,  
 filters: dict = None,  
 top_k: int = 5,  
 ) -> str:  
 context_chunks = self.retrieve(question, top_k=top_k, filters=filters)  
  
 if not context_chunks:  
 return "I don't have information about that in the available knowledge base."  
  
 context = "\\n\\n---\\n\\n".join(context_chunks)  
 system = system_prompt or (  
 "Answer questions based ONLY on the provided context. "  
 "If the context doesn't contain the answer, say so clearly. "  
 "Cite the source document in your answer."  
 )  
  
 response = self.openai.chat.completions.create(  
 model=self.chat_model,  
 messages=[  
 {"role": "system", "content": system},  
 {"role": "user", "content": f"Context:\\n{context}\\n\\nQuestion: {question}"}  
 ]  
 )  
 return response.choices[0].message.content  
  
  
# ── USAGE ────────────────────────────────  
  
rag = RAGPipeline(  
 index_name="project-knowledge",  
 namespace="docs",  
 similarity_threshold=0.72  
)  
  
# Ingest documents  
rag.ingest([  
 {"id": "overview", "text": open("docs/overview.md").read(),  
 "metadata": {"type": "overview", "version": "1.0"}},  
 {"id": "faq", "text": open("docs/faq.md").read(),  
 "metadata": {"type": "faq"}},  
])  
  
# Query  
answer = rag.answer(  
 question="How does the pricing work?",  
 system_prompt="You are a helpful product assistant.",  
 filters={"type": {"$eq": "faq"}}  
)  
print(answer)  
```  
  
---  
  
## MODULE 11 — NAMESPACE STRATEGY  
  
Namespaces = logical data isolation within one index. No extra cost.  
  
```  
# Pattern: {scope}-{identifier}  
  
Single-project index:  
├── namespace: docs → Documentation  
├── namespace: faq → Frequently asked questions  
├── namespace: procedures → Step-by-step procedures  
└── namespace: reference → Reference materials  
  
Multi-client index (agency model):  
├── namespace: client-{slug} → Per-client knowledge  
├── namespace: shared → Cross-client reference  
└── namespace: templates → Reusable templates  
  
Multi-domain index:  
├── namespace: {domain}-v1 → Version-controlled data  
└── namespace: {domain}-v2 → Rollout new version, switch on validation  
```  
  
**Namespace operations:**  
```python  
# Query specific namespace  
index.query(vector=emb, top_k=5, namespace="faq")  
  
# Stats per namespace  
stats = index.describe_index_stats()  
for ns, data in stats.namespaces.items():  
 print(f"{ns}: {data.vector_count} vectors")  
  
# Clear a namespace  
index.delete(delete_all=True, namespace="old-data")  
```  
  
---  
  
## MODULE 12 — CLI OPERATIONS  
  
```bash  
# Auth  
pc login  
  
# Index management  
pc index list  
pc index describe {index-name}  
pc index create --name {name} --dimension 1536 --metric cosine  
pc index delete {index-name}  
pc index stats {index-name}  
  
# Data operations  
pc index query --index {name} --query "search text" --top-k 5 --namespace docs  
pc index upsert --index {name} --namespace default  
  
# Assistant management  
pc assistant list  
pc assistant create --name {name}  
pc assistant upload --name {name} --file path/to/file.pdf  
pc assistant chat --name {name} --message "Your question here"  
pc assistant delete --name {name}  
```  
  
---  
  
## DECISION TREE  
  
```  
Pinecone task?  
├── New project, build RAG from scratch → MODULE 10 (Production Pipeline)  
├── Document Q\&A, no embedding pipeline → MODULE 8 (Assistant)  
├── Keyword + semantic combined → MODULE 7 (Hybrid Search)  
├── Need search results now → MODULE 6 (Query & Retrieval)  
├── Adding/updating data → MODULE 5 (Upsert)  
├── Choosing chunking approach → MODULE 4  
├── Picking embedding model → MODULE 3  
├── Designing index/naming → MODULE 2  
├── First-time setup → MODULE 1  
├── Claude Code integration → MODULE 9 (MCP)  
├── Multi-tenant isolation → MODULE 11 (Namespace Strategy)  
└── CLI-only management → MODULE 12  
```  
  
---  
  
## TROUBLESHOOTING  
  
| Error | Cause | Fix |  
|-------|-------|-----|  
| `API Key not found` | Missing env var | `export PINECONE_API_KEY="..."` |  
| Dimension mismatch on upsert | Wrong embedding model | Verify model dims match index |  
| Low/no results | Threshold too high | Lower `similarity_threshold` to 0.5 |  
| Empty results | Wrong namespace | Pass correct `namespace=` param |  
| Slow upsert | Batch size too small | Increase to 100 vectors/batch |  
| MCP not responding | Node.js missing | Install Node.js, restart Claude Code |  
| `/query` fails | Non-integrated index | Use external embeddings via MCP tools |  
| Assistant upload fails | `uv` not installed | `curl -LsSf https://astral.sh/uv/install.sh | sh` |  
| Inconsistent results | Mixed embedding models | Never mix model versions in same index |  
