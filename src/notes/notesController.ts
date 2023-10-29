import { Body, Controller, Delete, Get, Path, Post, Response, Route, SuccessResponse } from "tsoa";
import { NoteExistsError } from "../errors/NoteExistsError";
import { NoteNotFoundError } from "../errors/NoteNotFoundError";
import { Note } from "./note";
import { NoteCreationParams, NotesService } from "./noteService";

interface ValidateErrorJSON {
  message: "Validation failed";
  details: { [name: string]: unknown };
}

@Route("notes")
export class NotesController extends Controller {
  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @Response<NoteNotFoundError>(400, "Note with given title not found")
  @Get("{title}")
  public async getNote(@Path() title: string): Promise<Note> {
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
  public async createNote(@Body() requestBody: NoteCreationParams): Promise<void> {
    this.setStatus(201);
    new NotesService().create(requestBody);
    return;
  }

  @Response<ValidateErrorJSON>(422, "Validation Failed")
  @Response<NoteNotFoundError>(400, "Note with given title not found")
  @Delete("{title}")
  public async deleteNote(@Path() title: string): Promise<void> {
    new NotesService().delete(title);
    return;
  }
}
