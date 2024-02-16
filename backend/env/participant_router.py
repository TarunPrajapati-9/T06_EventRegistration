# app/router.py
from fastapi import APIRouter, HTTPException, Body, Depends, Request
from fastapi.security import APIKeyHeader
from fastapi.responses import JSONResponse
from response_error import ErrorResponseModel
from Controller.check_secret_key import authenticate_api_key
from Controller.participant_authenticate import get_authenticate_participant
from Controller.participant_controller import ParticipantController
from Model.participants_model import Participant
from Model.event_model import Event
from Model.registration_model import Registration
from config import params
import jwt

ParticipantRouter = APIRouter()
api_key_header = APIKeyHeader(name="API-Key")

async def get_api_key(api_key: str = Depends(api_key_header)):
    if api_key and not authenticate_api_key(api_key):
        error_response = ErrorResponseModel(status=False, error="Invalid API-Key")
        raise HTTPException(status_code=404, detail=dict(error_response))
    return api_key

@ParticipantRouter.post("/participant/login", response_model=Participant)
async def participant_login(data:dict = Body(...), api_key: str = Depends(get_api_key)):
    try:
        participant = await ParticipantController.participant_login(data)
        return participant
    except HTTPException as e:
        error_response = ErrorResponseModel(status=False, error=str(e.detail))
        raise HTTPException(status_code=e.status_code, detail=dict(error_response))
    except Exception as e:
        error_response = ErrorResponseModel(status=False, error=str(e))
        raise HTTPException(status_code=500, detail=dict(error_response))

@ParticipantRouter.post("/participant/register_participant", response_model=Participant)
async def register_participant(request: Request,register_data:dict = Body(...), api_key: str = Depends(get_api_key)) -> JSONResponse:
    try:
        registartion_creation = await ParticipantController.register_participant(register_data)
        return registartion_creation
    except HTTPException as e:
        error_response = ErrorResponseModel(status=False, error=str(e.detail))
        raise HTTPException(status_code=e.status_code, detail=dict(error_response))
    except Exception as e:
        error_response = ErrorResponseModel(status=False, error=str(e))
        raise HTTPException(status_code=500, detail=dict(error_response))

@ParticipantRouter.get("/participant/view_events", response_model=Event)
# @get_authenticate_participant
async def view_events(request: Request,api_key: str = Depends(get_api_key)) -> JSONResponse:
    try:
        event_display = await ParticipantController.view_events()
        return event_display
    except HTTPException as e:
        error_response = ErrorResponseModel(status=False, error=str(e.detail))
        raise HTTPException(status_code=e.status_code, detail=dict(error_response))
    except Exception as e:
        error_response = ErrorResponseModel(status=False, error=str(e))
        raise HTTPException(status_code=500, detail=dict(error_response))

@ParticipantRouter.get("/participant/view_registered_event", response_model=Event)
@get_authenticate_participant
async def view_registered_event(request: Request,api_key: str = Depends(get_api_key)) -> JSONResponse:
    try:
        token = request.headers.get('token')
        if not token:
            error_response = ErrorResponseModel(status=False, error="Missing token")
            raise HTTPException(status_code=401, detail=dict(error_response))
        try:
            decoded_token = jwt.decode(token, params['SECRET_KEY'], algorithms=['HS256'])
            participant_id = decoded_token.get('_id')
            if participant_id:
                event_display = await ParticipantController.view_registered_event(participant_id)
                return event_display
            else:
                error_response = ErrorResponseModel(status=False, error="Participant not found")
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


@ParticipantRouter.get("/participant/event_register/{event_id}", response_model=Registration)
@get_authenticate_participant
async def event_register(request: Request,event_id:str,api_key: str = Depends(get_api_key)) -> JSONResponse:
    try:
        token = request.headers.get('token')
        if not token:
            error_response = ErrorResponseModel(status=False, error="Missing token")
            raise HTTPException(status_code=401, detail=dict(error_response))
        try:
            decoded_token = jwt.decode(token, params['SECRET_KEY'], algorithms=['HS256'])
            participant_id = decoded_token.get('_id')
            if participant_id:
                event_display = await ParticipantController.event_register(participant_id, event_id)
                return event_display
            else:
                error_response = ErrorResponseModel(status=False, error="Participant not found")
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



@ParticipantRouter.get("/participant/view_participant", response_model=Participant)
@get_authenticate_participant
async def participant_find(request: Request, api_key: str = Depends(get_api_key)):
    try:
        token = request.headers.get('token')
        if not token:
            error_response = ErrorResponseModel(status=False, error="Missing token")
            raise HTTPException(status_code=401, detail=dict(error_response))
        try:
            decoded_token = jwt.decode(token, params['SECRET_KEY'], algorithms=['HS256'])
            participant_id = decoded_token.get('_id')
            if participant_id:
                view_participant = await ParticipantController.particicpant_find(participant_id)
                return view_participant
            else:
                error_response = ErrorResponseModel(status=False, error="Participant not found")
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


@ParticipantRouter.get("/participant/view_event/{event_id}", response_model=Participant)
@get_authenticate_participant
async def event_find(request: Request,event_id:str, api_key: str = Depends(get_api_key)):
    try:
        view_event = await ParticipantController.event_find(event_id)
        return view_event
    except HTTPException as e:
        error_response = ErrorResponseModel(status=False, error=str(e.detail))
        raise HTTPException(status_code=e.status_code, detail=dict(error_response))
    except Exception as e:
        error_response = ErrorResponseModel(status=False, error=str(e))
        raise HTTPException(status_code=500, detail=dict(error_response))