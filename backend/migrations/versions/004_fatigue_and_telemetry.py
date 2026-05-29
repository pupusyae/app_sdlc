"""add_fatigue_and_telemetry_tables

Revision ID: 004
Revises: 003
Create Date: 2025-05-28 17:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "fatigue_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("session_id", sa.String(255), nullable=False, index=True),
        sa.Column("domain", sa.String(100), nullable=False),
        sa.Column("severity", sa.String(50), nullable=False),
        sa.Column("fatigue_level", sa.Integer(), server_default="0"),
        sa.Column("warning_count", sa.Integer(), server_default="0"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )

    op.create_table(
        "telemetry_snapshots",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("metric_name", sa.String(100), nullable=False),
        sa.Column("metric_value", sa.Float(), nullable=False),
        sa.Column("metadata", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now(), index=True),
    )


def downgrade() -> None:
    op.drop_table("telemetry_snapshots")
    op.drop_table("fatigue_events")
