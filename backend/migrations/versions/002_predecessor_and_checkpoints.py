"""add_predecessor_and_checkpoints

Revision ID: 002
Revises: 001
Create Date: 2025-05-28 16:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("adr_records", sa.Column("predecessor_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.add_column("adr_records", sa.Column("deprecation_reason", sa.Text(), nullable=True))
    op.create_foreign_key("fk_adr_predecessor", "adr_records", "adr_records", ["predecessor_id"], ["id"])

    op.create_table(
        "cognitive_checkpoints",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("project_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("projects.id"), nullable=False),
        sa.Column("label", sa.String(255), nullable=False),
        sa.Column("snapshot", postgresql.JSONB(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("cognitive_checkpoints")
    op.drop_constraint("fk_adr_predecessor", "adr_records", type_="foreignkey")
    op.drop_column("adr_records", "deprecation_reason")
    op.drop_column("adr_records", "predecessor_id")
