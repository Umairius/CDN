import { Injectable } from "@nestjs/common";
import * as fs from 'fs';

@Injectable()
export class FileStoreService {


    
    private directoryPath: string = '../files'; // Replace with your directory path
    private filesToUpload: string[] = []; // Initialize with an empty array

    constructor() {
        // Initialize the list of files when the service is created
        this.updateFilesToUpload();
    }

    // Function to update the list of files to upload
    private updateFilesToUpload() {
        fs.readdir(this.directoryPath, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                return;
            }
            // Update the list of files with the new file names
            this.filesToUpload = files;
            console.log('Updated files to upload:', this.filesToUpload);
        });
    }

    // Function to get the current list of files to upload
    getFilesToUpload(): string[] {
        return this.filesToUpload;
    }

    // Call this function whenever there is a change in the directory
    onDirectoryChange() {
        this.updateFilesToUpload();
    }
}
