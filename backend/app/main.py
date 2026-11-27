from fastapi import FastAPI, HTTPException, Request, Path
from io import BytesIO
from pathlib import Path as FilePath
from tempfile import mkdtemp
from zipfile import BadZipFile, ZipFile




app = FastAPI()
cases = {1: {"status": "done"}}


@app.get("/cases/{case_id}", summary="Get a case by ID")
async def get_case_by_id(case_id: int = Path(title="Case ID", gt=0)):

    case = cases.get(case_id)

    if case is None:
        raise HTTPException(status_code=404, detail="Case not found")  # Return 404 when no case matches the requested ID
    return case


@app.get("/cases/{case_id}/status", summary="Get a case's status")
async def get_case_status_by_id(case_id: int = Path(title="Case ID", gt=0)):

    case = cases.get(case_id)

    if case is None:
        raise HTTPException(status_code=404, detail="Case not found")  # Return 404 when no case matches the requested ID
    
    return {"id": case_id, "status": case["status"]}


@app.post("/cases", summary="Upload a case")
async def upload_case(request: Request):

    archive_bytes = await request.body()
    file_names = []

    try:
        with ZipFile(BytesIO(archive_bytes)) as archive:  # Open the uploaded ZIP directly in memory
            
            for entry in archive.infolist():
                if entry.is_dir():
                    continue

                archive_name = entry.filename.replace("\\", "/")
                name = FilePath(archive_name).name
                if name in file_names:
                    continue

                extension = FilePath(archive_name).suffix.lower()
                if extension not in {".json", ".log"}:
                    raise HTTPException(status_code=400, detail="Invalid file extension")  # Return 400 when a file has an unsupported extension

                file_names.append(name)

            upload_root = FilePath("/tmp/tracegraph-cases")
            upload_root.mkdir(exist_ok=True)
            case_dir = FilePath(mkdtemp(prefix="case-", dir=upload_root))

    except BadZipFile:
        raise HTTPException(status_code=400, detail="Invalid ZIP archive")  # Return 400 when the request body is not a valid ZIP archive

    return {"files": file_names}

