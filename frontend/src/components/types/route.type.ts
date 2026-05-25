

export type RouteType = {
    route: string,
    title: string,
    filePathTemplate: string,
    load() : void ,
    existSidebar: boolean,
}