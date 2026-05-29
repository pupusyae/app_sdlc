"""add_users_sessions_tables

Revision ID: 006
Revises: 005
Create Date: 2025-05-28 18:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "006"
down_revision: Union[str, None] = "005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True, index=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("encrypted_api_key", sa.String(1024), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default="true", nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )

    op.create_table(
        "sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )

    op.add_column("fatigue_events", sa.Column("session_id_fk", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_foreign_key("fk_fatigue_session", "fatigue_events", "sessions", ["session_id_fk"], ["id"])


def downgrade() -> None:
    op.drop_constraint("fk_fatigue_session", "fatigue_events", type_="foreignkey")
    op.drop_column("fatigue_events", "session_id_fk")
    op.drop_table("sessions")
    op.drop_table("users")
