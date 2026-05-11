import os
from typing import Dict, Any, Optional

# Mock implementation for initial scaffolding without valid credentials
# In production, we would use firebase-admin
class FirestoreService:
    def __init__(self):
        self.mock_db = {}
        print("Initialized FirestoreService (Mock Mode)")

    async def add_document(self, collection: str, data: Dict[str, Any], doc_id: Optional[str] = None) -> str:
        if collection not in self.mock_db:
            self.mock_db[collection] = {}
        
        if not doc_id:
            import uuid
            doc_id = str(uuid.uuid4())
        
        self.mock_db[collection][doc_id] = data
        print(f"Mock DB: Added to {collection}/{doc_id}: {data}")
        return doc_id

    async def get_document(self, collection: str, doc_id: str) -> Optional[Dict[str, Any]]:
        return self.mock_db.get(collection, {}).get(doc_id)

    async def get_collection(self, collection: str) -> Dict[str, Any]:
        return self.mock_db.get(collection, {})

db = FirestoreService()
