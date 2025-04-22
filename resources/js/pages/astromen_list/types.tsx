type simpleDial = Array<{
    id: number,
    name: string
}>;

type astromenRow = {
    id: number,
    first_name: string,
    last_name: string,
    DOB: string,
    dobCz: string,
    skill_names: Array<string>,
    skills: Array<simpleDial>
};

type astromen = Array<astromenRow>;

type paginatorLinks = Array<{
    url: string|null,
    active: boolean,
    label: string
}>;

export type {astromen, astromenRow, simpleDial, paginatorLinks}
