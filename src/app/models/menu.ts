// 1: grupo, 2: basic, 3: collapsable, 4: divider
export interface Menu {
    id?: number;
    type?: 1 | 2 | 3 | 4 | number;
    nameGrupo?: string | null;
    descGrupo?: string | null;
    name?: string | null;
    //hasBadge?: boolean;
    //hasBadge(): boolean;
    titleBadge?: string | null;
    classBadge?: string | null;
    link?: string | null;
    //hasIcon?: boolean;
    nameIcon: string;
    active?: boolean | null;
    disabled?: boolean | null;
    tooltip?: string | null;
    //collapsable?: boolean;
    submenu?: Menu[] | null;
    externalLink?: boolean;
    target?: | '_blank' | '_self' | string;
    expanded: boolean;
}

/*
        id?: string;
        title?: string;
        subtitle?: string;
        type:
            | 'aside'
            | 'basic'
            | 'collapsable'
            | 'divider'
            | 'group'
            | 'spacer';
        hidden?: (item: FuseNavigationItem) => boolean;
        active?: boolean;
        disabled?: boolean;
        tooltip?: string;
    link?: string;
    fragment?: string;
    preserveFragment?: boolean;
    queryParams?: Params | null;
    queryParamsHandling?: QueryParamsHandling | null;
    externalLink?: boolean;
    target?:
        | '_blank'
        | '_self'
        | '_parent'
        | '_top'
        | string;
    exactMatch?: boolean;
    isActiveMatchOptions?: IsActiveMatchOptions;
    function?: (item: FuseNavigationItem) => void;
    classes?: {
        title?: string;
        subtitle?: string;
        icon?: string;
        wrapper?: string;
    };
    icon?: string;
    badge?: {
        title?: string;
        classes?: string;
    };
    children?: FuseNavigationItem[];
    meta?: any;*/
