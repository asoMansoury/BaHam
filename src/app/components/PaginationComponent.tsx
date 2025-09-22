import React, { useEffect } from 'react'
import {Pagination} from '@heroui/react';
import clsx from 'clsx';
import usePaginationStore from '../hooks/usePaginationStore';
export default function PaginationComponent({totalCount}:{
    totalCount:number
}) {


    const pagination  = usePaginationStore((s) => s.pagination);
    const setPage     = usePaginationStore((s) => s.setPage);
    const setPageSize = usePaginationStore((s) => s.setPageSize);
    const setPagination = usePaginationStore((s) => s.setPagination);

     useEffect(()=>{
        setPagination(totalCount)
     },[setPagination,totalCount]);

     const {pageNumber,pageSize,totalPages} = pagination;

     const start = (pageNumber - 1) * pageSize + 1;
     const end = Math.min(
        pageNumber * pageSize,
        totalCount
     )
     const resultText= `Showing ${start} - ${end} of ${totalCount} results`;

  return (
    <div className='border-2-2 w-full mt-5'>
        <div className='flex flex-row justify-between items-center p-5'>
            <div>{resultText}</div>
            <Pagination
                total={totalPages}
                color='default'
                page={pageNumber}
                variant='bordered'
                onChange={setPage}
            >
                <div className='flex flex-row gap-1 items-center'>
                    Page size:
                    {
                        [3,6,12].map((size)=>(
                            <div key={size}
                                onClick={()=>setPageSize(size)}
                                className={clsx("page-size-box",{"bg-foreground text-white hover::bg-foreground hover::text-white":size===pageSize})}
                            >
                                {size}
                            </div>
                        ))
                    }
                </div>
            </Pagination>
        </div>
    </div>
  )
}
