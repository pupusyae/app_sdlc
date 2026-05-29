import asyncio
import json
from app.core.redis import get_redis
from app.governance.predictive_drift import check_predictive_drift


async def process_predictive_scan():
    redis = await get_redis()

    while True:
        try:
            result = await redis.brpop("cognitive:tasks:predictive_scan", timeout=5)
            if result is None:
                continue

            _, task_json = result
            task = json.loads(task_json)

            user_input = task.get("user_input", "")
            active_domain = task.get("active_domain", "")
            session_id = task.get("session_id", "")

            warnings = await check_predictive_drift(user_input, active_domain)

            if warnings:
                await redis.setex(
                    f"cognitive:predictive:{session_id}",
                    900,
                    json.dumps(warnings),
                )

        except Exception:
            await asyncio.sleep(1)


async def main():
    print("Cognitive Prediction Worker started. Listening for tasks...")
    await process_predictive_scan()


if __name__ == "__main__":
    asyncio.run(main())
