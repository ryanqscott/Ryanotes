import fs from "fs";
import { Note } from "./note";
import moment from "moment";
import { NoteExistsError } from "../errors/NoteExistsError";

export type NoteCreationParams = Pick<Note, "title" | "text" >;

export class NotesService {
  public get(title: string): Note {
    if (!fs.existsSync(`./data/${title}.txt`)) {
      throw new Error('note with given title does not exist');
    }
    const noteText = fs.readFileSync(`./data/${title}.txt`);
    return JSON.parse(noteText.toString());
  }

  public create(noteCreationParams: NoteCreationParams): void {
    const title = noteCreationParams.title;
    if (fs.existsSync(`./data/${title}.txt`)) {
      throw new NoteExistsError(`note with the title "${title}" already exists`);
    }
    const note: Note = {
      lastModified: moment().format(),
      archived: false,
      ...noteCreationParams
    }
    fs.writeFile(`./data/${title}.txt`, JSON.stringify(note), err => {
      console.error(err);
    });
  }
}