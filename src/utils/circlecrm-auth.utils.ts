export class CirclecrmAuthUtils {

    public static decode<T>(json: string): T {
        return JSON.parse(json, (key, value) => {
            return (key === 'created' || key === 'updated') ? new Date(value) : value;
        }) as T;
    }

    public static mergeUrlFragments(...part: string[]): string {
        let result = '';

        part.forEach((p) => {
            result += result === '' || result.endsWith('/') ? p : '/' + p;
        });

        return result;
    }

}
