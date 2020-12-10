import { isCustomProvider } from "./custom-provider";
import { ProviderToken, ProviderType } from "./provider.interface";

export function ProviderTypeToString(type: ProviderType): string {
    if (isCustomProvider(type)) {
        return ProviderTokenToString(type.token);
    }

    return String(type?.name || type) as string;

}

export function ProviderTokenToString(token: ProviderToken): string {
    if (typeof token === "string") {
        return token;
    }

    return String(token?.name || token) as string;
}
