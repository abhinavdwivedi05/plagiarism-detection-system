from app.database.connection import get_database
from app.utils.auth import hash_password


async def seed_default_faculty() -> None:
    db = get_database()
    existing = await db.users.find_one({"email": "faculty@university.edu"})
    if existing:
        return
    await db.users.insert_one({
        "email": "faculty@university.edu",
        "full_name": "Demo Faculty",
        "password": hash_password("faculty123"),
        "role": "faculty",
    })
