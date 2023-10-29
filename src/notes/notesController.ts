import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  SuccessResponse,
  Response,
  Delete,
} from "tsoa";
import { Note } from "./note";
import { NotesService, NoteCreationParams } from "./noteService";
import { NoteExistsError } from "../errors/NoteExistsError";
import { NoteNotFoundError } from "../errors/NoteNotFoundError";

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
  public async createNote(
    @Body() requestBody: NoteCreationParams
  ): Promise<void> {
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
