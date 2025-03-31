export function mapProperties<T extends object, U extends object>(
    source: T, 
    destinationType: new () => U
): U {
    const destination = new destinationType();
    
    Object.keys(destination).forEach(key => {
        if (key in source) {
            (destination as any)[key] = (source as any)[key];
        }
    });

    return destination;
}
export function mapArray<T extends object, U extends object>(
    sourceArray: T[], 
    destinationType: new () => U
): U[] {
    return sourceArray.map(item => mapProperties(item, destinationType));
}


export function mapPropertiesType<T extends object, U extends object>(source: T, destinationFactory: () => U): U {
    const destination = destinationFactory(); // Create an instance of U
    Object.keys(destination).forEach(key => {
        if (key in source) {
            (destination as any)[key] = (source as any)[key]; // Copy matching properties
        }
    });
    return destination;
}

export function mapArrayType<T extends object, U extends object>(sourceArray: T[], destinationFactory: () => U): U[] {
    return sourceArray.map(item => mapPropertiesType(item, destinationFactory)); // Fixed function reference
}
