import httpx
import asyncio

async def test_create_goal():
    url = "http://127.0.0.1:8002/goals/"
    payload = {
        "user_id": "test_user_123",
        "long_term_goal": "Become a Python Master",
        "baseline": "Knows basic syntax",
        "deadline": "2024-12-31",
        "daily_time_weekday": 60,
        "daily_time_weekend": 120
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        assert response.status_code == 200
        data = response.json()
        assert data["user_id"] == "test_user_123"
        assert "id" in data

async def main():
    try:
        await test_create_goal()
        print("Test Passed!")
    except Exception as e:
        print(f"Test Failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
