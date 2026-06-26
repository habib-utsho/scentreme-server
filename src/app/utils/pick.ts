const pick = (obj: Record<string, unknown>, keys: string[]) => {
    const picked: Record<string, unknown> = {};
    keys.forEach(key => {
        if (obj[key]) {
            picked[key] = obj[key];
        }
    });
    return picked;
};

export default pick;