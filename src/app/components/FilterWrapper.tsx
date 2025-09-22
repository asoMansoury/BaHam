'use client'

import { usePathname } from "next/navigation";
import Filters from "./Filter";

export default function FiltersWrapper(){
    const pathName = usePathname();
    if(pathName ==="/members") return <Filters></Filters>
    else return null;

}