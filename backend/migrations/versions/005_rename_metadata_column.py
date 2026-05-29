"""rename_metadata_to_meta_info

Revision ID: 005
Revises: 004
Create Date: 2025-05-28 17:30:00.000000

"""
from typing import Sequence, Union
from alembic import op

revision: str = "005"
down_revision: Union[str, None] = "004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE telemetry_snapshots RENAME COLUMN metadata TO meta_info")


def downgrade() -> None:
    op.execute("ALTER TABLE telemetry_snapshots RENAME COLUMN meta_info TO metadata")
