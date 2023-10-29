import fs from "fs";
import { Note } from "./note";
import moment from "moment";
import { NoteExistsError } from "../errors/NoteExistsError";
import { NoteNotFoundError } from "../errors/NoteNotFoundError";

export type NoteCreationParams = Pick<Note, "title" | "text">;
const NOTES_DIRECTORY = "./data";
export class NotesService {
  public get(title: string): Note {
    if (!fs.existsSync(`${NOTES_DIRECTORY}/${title}.txt`)) {
      throw new NoteNotFoundError("note with given title does not exist");
    }
    const noteText = fs.readFileSync(`${NOTES_DIRECTORY}/${title}.txt`);
    return JSON.parse(noteText.toString());
  }

  public delete(title: string): void {
    if (!fs.existsSync(`${NOTES_DIRECTORY}/${title}.txt`)) {
      throw new NoteNotFoundError("note with given title does not exist");
    }
    fs.rmSync(`${NOTES_DIRECTORY}/${title}.txt`);
  }

  public getAll(): Note[] {
    const notes: Note[] = [];
    let currentNoteContent;
    fs.readdirSync(NOTES_DIRECTORY).forEach((fileName) => {
      currentNoteContent = fs.readFileSync(`${NOTES_DIRECTORY}/${fileName}`);
      notes.push(JSON.parse(currentNoteContent.toString()));
    });
    return notes;
  }

  public create(noteCreationParams: NoteCreationParams): void {
    const title = noteCreationParams.title;
    if (fs.existsSync(`${NOTES_DIRECTORY}/${title}.txt`)) {
      throw new NoteExistsError(
        `note with the title "${title}" already exists`
      );
    }
    const note: Note = {
      lastModified: moment().format(),
      archived: false,
      ...noteCreationParams,
    };
    fs.writeFile(
      `${NOTES_DIRECTORY}/${title}.txt`,
      JSON.stringify(note),
      (err) => {
        console.error(err);
      }
    );
  }
}
