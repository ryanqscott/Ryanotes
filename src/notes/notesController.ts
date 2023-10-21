import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,
    Response
  } from "tsoa";
  import { Note } from "./note";
  import { NotesService, NoteCreationParams } from "./noteService";
import { NoteExistsError } from "../errors/NoteExistsError";
  
  interface ValidateErrorJSON {
    message: "Validation failed";
    details: { [name: string]: unknown };
  }

  @Route("notes")
  export class NotesController extends Controller {
    
    @Response<ValidateErrorJSON>(422, "Validation Failed")
    @Get("{title}")
    public async getNote(
      @Path() title: string,
    ): Promise<Note> {
      return new NotesService().get(title);
    }

    @Response<ValidateErrorJSON>(422, "Validation Failed")
    @Get()
    public async getNotes(): Promise<Note[]> {
      return new NotesService().getAll();
    }
    
    @Response<ValidateErrorJSON>(422, "Validation Failed")
    @Response<NoteExistsError>(400, "Note already exists")
    @SuccessResponse("201", "Created")
    @Post()
    public async createNote(
      @Body() requestBody: NoteCreationParams
    ): Promise<void> {
      this.setStatus(201);
      new NotesService().create(requestBody);
      return;
    }
  }