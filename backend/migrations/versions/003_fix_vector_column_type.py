"""fix_vector_column_type

Revision ID: 003
Revises: 002
Create Date: 2025-05-28 16:10:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE knowledge_vectors ALTER COLUMN embedding TYPE vector(1536) USING embedding::vector(1536)")


def downgrade() -> None:
    op.execute("ALTER TABLE knowledge_vectors ALTER COLUMN embedding TYPE double precision[] USING embedding::double precision[]")
