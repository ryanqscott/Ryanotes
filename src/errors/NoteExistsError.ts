export class NoteExistsError extends Error {
    constructor(message: string) {
        super(message);
    }
}