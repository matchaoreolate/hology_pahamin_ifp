"""
Database custom column types with cross-dialect compatibility.
Ensures JSONB and UUID work on PostgreSQL while falling back gracefully on SQLite in tests.
"""
from sqlalchemy import JSON, Uuid
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

# PostgreSQL uses high-performance JSONB; SQLite uses generic JSON
JSON_TYPE = JSON().with_variant(JSONB, "postgresql")

# PostgreSQL uses native UUID; SQLite uses CHAR(32)/CHAR(36) string representation
UUID_TYPE = Uuid(as_uuid=True).with_variant(PG_UUID(as_uuid=True), "postgresql")
