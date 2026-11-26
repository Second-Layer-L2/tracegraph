from fastapi import FastAPI, HTTPException, Path




app = FastAPI()
cases = {1: {"status": "done"}}


@app.get("/cases/{case_id}", summary="Get a case by ID")
async def get_case_by_id(case_id: int = Path(title="Case ID", gt=0)):

    case = cases.get(case_id)

    if case is None:
        raise HTTPException(status_code=404, detail="Case not found")  # Return 404 when no case matches the requested ID.
    return case


@app.get("/cases/{case_id}/status", summary="Get a case's status")
async def get_case_status_by_id(case_id: int = Path(title="Case ID", gt=0)):

    case = cases.get(case_id)

    if case is None:
        raise HTTPException(status_code=404, detail="Case not found")  # Return 404 when no case matches the requested ID.
    return {"id": case_id, "status": case["status"]}
