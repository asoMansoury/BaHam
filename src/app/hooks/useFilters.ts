import { usePathname, useRouter,useSearchParams  } from "next/navigation";
import { FaFemale, FaMale } from "react-icons/fa";
import useFilterStore from "./useFilterStore";
import { ChangeEvent, useEffect } from "react";
import { Selection } from '@heroui/react';
import usePaginationStore from "./usePaginationStore";
export const useFilters =() =>{
    const pathname = usePathname();
    const router = useRouter();
    const currentSearch = useSearchParams(); 
    const {filters,setFilters} = useFilterStore();
    const pageNumber = usePaginationStore((s) => s.pagination.pageNumber);
    const pageSize   = usePaginationStore((s) => s.pagination.pageSize);
    const totalCount = usePaginationStore((s) => s.pagination.totalCount);
    const setPage    = usePaginationStore((s) => s.setPage);
    const {gender,ageRange,orderBy,withPhoto} = filters;

  useEffect(() => {
        const searchparams = new URLSearchParams(currentSearch?.toString() ?? "");

        if (gender?.length) searchparams.set("gender", gender.join(","));
        if (ageRange?.length) searchparams.set("ageRange", ageRange.toString());
        if (orderBy) searchparams.set("orderBy", orderBy);
        if (pageSize) searchparams.set("pageSize", pageSize.toString());
        if (pageNumber) searchparams.set("pageNumber", pageNumber.toString());
        if (withPhoto !== undefined) searchparams.set("withPhoto", withPhoto.toString());

        router.replace(`${pathname}?${searchparams.toString()}`);
    }, [gender, ageRange, orderBy, pageSize, pageNumber, withPhoto, router, pathname, currentSearch]);

    
    useEffect(()=>{
        if(gender || ageRange || orderBy || withPhoto){
            setPage(1)
        }
    },[gender,ageRange,orderBy,withPhoto])
    
    const orderByList= [
        {label:'Last active', value:"updated"},
        {label:"Newest members", value:"created"},
    ];

    const genderList = [
        {value:"male",icon:FaMale},
        {value:"female",icon:FaFemale},
    ];



    const handleAgeSelect = (value:number[])=>{
        setFilters("ageRange",value)
    };

    const handleOrderSelect = (value:Selection)=>{

        
        if(value instanceof Set){
            setFilters('orderBy',value.values().next().value);
        }
    }

    const handleGenderSelect = (value:string) =>{
        if(gender.includes(value)){
            setFilters('gender',gender.filter(genderValue=>genderValue !==value))
        }
        else {
            setFilters('gender',[...gender,value]);
        }
    }

    const handleWithPhotoToggle =(e:ChangeEvent<HTMLInputElement>)=>{
        setFilters('withPhoto',e.target.checked);
    }

    return {
        orderByList,
        genderList,
        selectAge:handleAgeSelect,
        selectGender:handleGenderSelect,
        selectOrder:handleOrderSelect,
        selectWithPhoto:handleWithPhotoToggle,
        filters,
        totalCount
    }
}