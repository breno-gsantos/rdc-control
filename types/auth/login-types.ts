export type LoginActionResult =
    | {
        success: true;
        message: string;
    } | {
        success: false;
        error: string;
    }