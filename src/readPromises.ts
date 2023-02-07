export function promiseReadAsText(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result === null) {
                reject("Something is wrong");
                return;
            } else {
                resolve(`${reader.result}`);
            }
        };
        reader.readAsText(file);
    });
}

export function promiseReadAsURL(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result === null) {
                reject("Something is wrong");
                return;
            } else {
                resolve(`${reader.result}`);
            }
        };
        reader.readAsDataURL(file);
    });
}

export const emptyPromise = () => {
    return new Promise<string>(() => {});
};