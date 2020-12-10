import { callFirstFunction, GLogger } from "gtools/GUtils";
import { AppOptions } from "..";
import { createAppFactory } from "../factory/factory-creators";
import { Factory } from "../factory/factory.interface";
import { ProviderTokenToString } from "../providers/provider-utils";
import { ProviderToken } from "../providers/provider.interface";
import { Type } from "../type";

interface AppHolder<T = any> {
    app: Type<T>
    options: AppOptions;
    factory?: Factory;
    beforeCallback?: () => Promise<void>;
    afterCallback?: () => Promise<void>;
}

const apps: Map<ProviderToken, AppHolder> = new Map();

export function registerApp(app: any, options: AppOptions): void {
    apps.set(app, {
        app,
        options,
    });
}

export interface BasicApp {
    start?(...params: any[]): number;

    beforeStart?(): number;

    afterStart?(): number;
}

function getAppDataHolder<T>(token: ProviderToken<T>): AppHolder {
    const appData = apps.get(token);
    if (!appData) {
        throw new Error("Cannot get app: " + ProviderTokenToString(token));
    }

    return appData;
}

export function getAppFactory<T>(token: ProviderToken<T>): Factory {
    const appData = getAppDataHolder(token);
    return createAppFactory(appData.app, appData.options);
}

export async function startApp<T extends BasicApp>(token: ProviderToken<T> & Type<T>): Promise<boolean> {
    const appData     = getAppDataHolder(token);
    appData.factory   = getAppFactory(token);
    const appInstance = appData.factory.require(token);

    GLogger.log("App " + appData.app.name + " successfully created", "AppHolder");

    await callFirstFunction(appData!.beforeCallback, appInstance.beforeStart);
    const result = await callFirstFunction(appInstance.start);
    await callFirstFunction(appData!.afterCallback, appInstance.afterStart);

    return result;
}
