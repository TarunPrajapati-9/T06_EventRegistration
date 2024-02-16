from fastapi import APIRouter, HTTPException, Body, Depends, Request
from fastapi.security import APIKeyHeader
from fastapi.responses import JSONResponse
from response_error import ErrorResponseModel
from Controller.check_secret_key import authenticate_api_key
from Controller.organizer_authenticate import get_authenticate_organizer
from Controller.organizer_controller import OrganizerController
from Controller.event_controller import EventController
from Model.organizer_model import Organizer
from Model.event_model import Event
from config import params
import jwt

OrganizerRouter = APIRouter()
api_key_header = APIKeyHeader(name="API-Key")

async def get_api_key(api_key: str = Depends(api_key_header)):
    if api_key and not authenticate_api_key(api_key):
        error_response = ErrorResponseModel(status=False, error="Invalid API-Key")
        raise HTTPException(status_code=404, detail=dict(error_response))
    return api_key

@OrganizerRouter.post("/organizer/login", response_model=Organizer)
async def organizer_login(data:dict = Body(...), api_key: str = Depends(get_api_key)):
    try:
        organizer = await OrganizerController.organizer_login(data)
        return organizer
    except HTTPException as e:
        error_response = ErrorResponseModel(status=False, error=str(e.detail))
        raise HTTPException(status_code=e.status_code, detail=dict(error_response))
    except Exception as e:
        error_response = ErrorResponseModel(status=False, error=str(e))
        raise HTTPException(status_code=500, detail=dict(error_response))

@OrganizerRouter.post("/organizer/create_event", response_model=Event)
@get_authenticate_organizer
async def create_event(request: Request,event_:dict = Body(...), api_key: str = Depends(get_api_key)) -> JSONResponse:
    try:
        token = request.headers.get('token')
        if not token:
            error_response = ErrorResponseModel(status=False, error="Missing token")
            raise HTTPException(status_code=401, detail=dict(error_response))
        try:
            decoded_token = jwt.decode(token, params['SECRET_KEY'], algorithms=['HS256'])
            organizer_id = decoded_token.get('_id')

            if organizer_id:
                event_display = await EventController.create_event(event_,str(organizer_id))
                return event_display
            else:
                error_response = ErrorResponseModel(status=False, error="Organizer not found")
                raise HTTPException(status_code=401, detail=dict(error_response))
        except jwt.ExpiredSignatureError:
            error_response = ErrorResponseModel(status=False, error="Token expired")
            raise HTTPException(status_code=401, detail=dict(error_response))

    except HTTPException as e:
        error_response = ErrorResponseModel(status=False, error=str(e.detail))
        raise HTTPException(status_code=e.status_code, detail=dict(error_response))
    except Exception as e:
        error_response = ErrorResponseModel(status=False, error=str(e))
        raise HTTPException(status_code=500, detail=dict(error_response))


@OrganizerRouter.get("/organizer/delete_event/{event_id}", response_model=Event)
@get_authenticate_organizer
async def delete_event(request: Request,event_id:str,api_key: str = Depends(get_api_key)) -> JSONResponse:
    try:
        event_deletion = await EventController.delete_event(event_id)
        return event_deletion
    except HTTPException as e:
        error_response = ErrorResponseModel(status=False, error=str(e.detail))
        raise HTTPException(status_code=e.status_code, detail=dict(error_response))
    except Exception as e:
        error_response = ErrorResponseModel(status=False, error=str(e))
        raise HTTPException(status_code=500, detail=dict(error_response))


@OrganizerRouter.post("/organizer/edit_event", response_model=Event)
@get_authenticate_organizer
async def edit_event(request: Request,event_:dict = Body(...), api_key:str = Depends(get_api_key)) -> JSONResponse:
    try:
        event_updation = await EventController.edit_event(event_)
        return event_updation
    except HTTPException as e:
        error_response = ErrorResponseModel(status=False, error=str(e.detail))
        raise HTTPException(status_code=e.status_code, detail=dict(error_response))
    except Exception as e:
        error_response = ErrorResponseModel(status=False, error=str(e))
        raise HTTPException(status_code=500, detail=dict(error_response))

@OrganizerRouter.get("/organizer/view_event", response_model=Event)
@get_authenticate_organizer
async def view_event(request: Request,api_key: str = Depends(get_api_key)) -> JSONResponse:
    try:
        token = request.headers.get('token')
        if not token:
            error_response = ErrorResponseModel(status=False, error="Missing token")
            raise HTTPException(status_code=401, detail=dict(error_response))
        try:
            decoded_token = jwt.decode(token, params['SECRET_KEY'], algorithms=['HS256'])
            organizer_id = decoded_token.get('_id')

            if organizer_id:
                event_display = await EventController.view_event(str(organizer_id))
                return event_display
            else:
                error_response = ErrorResponseModel(status=False, error="Organizer not found")
                raise HTTPException(status_code=401, detail=dict(error_response))
        except jwt.ExpiredSignatureError:
            error_response = ErrorResponseModel(status=False, error="Token expired")
            raise HTTPException(status_code=401, detail=dict(error_response))

    except HTTPException as e:
        error_response = ErrorResponseModel(status=False, error=str(e.detail))
        raise HTTPException(status_code=e.status_code, detail=dict(error_response))
    except Exception as e:
        error_response = ErrorResponseModel(status=False, error=str(e))
        raise HTTPException(status_code=500, detail=dict(error_response))

@OrganizerRouter.get("/organizer/view_participant/{event_id}", response_model=Event)
@get_authenticate_organizer
async def view_participant(request: Request,event_id:str,api_key: str = Depends(get_api_key)) -> JSONResponse:
    try:
        token = request.headers.get('token')
        if not token:
            error_response = ErrorResponseModel(status=False, error="Missing token")
            raise HTTPException(status_code=401, detail=dict(error_response))
        try:
            decoded_token = jwt.decode(token, params['SECRET_KEY'], algorithms=['HS256'])
            organizer_id = decoded_token.get('_id')

            if organizer_id:
                participant_display = await EventController.view_participant(str(organizer_id),event_id)
                return participant_display
            else:
                error_response = ErrorResponseModel(status=False, error="Organizer not found")
                raise HTTPException(status_code=401, detail=dict(error_response))
        except jwt.ExpiredSignatureError:
            error_response = ErrorResponseModel(status=False, error="Token expired")
            raise HTTPException(status_code=401, detail=dict(error_response))

    except HTTPException as e:
        error_response = ErrorResponseModel(status=False, error=str(e.detail))
        raise HTTPException(status_code=e.status_code, detail=dict(error_response))
    except Exception as e:
        error_response = ErrorResponseModel(status=False, error=str(e))
        raise HTTPException(status_code=500, detail=dict(error_response))