'use client';

import { Button, Select, SelectItem, Slider, Switch } from '@heroui/react';
import React from 'react'
import { useFilters } from '../hooks/useFilters';

export default function Filters() {
    const {
        orderByList,
        genderList,
        selectAge,
        selectGender,
        selectOrder,
        selectWithPhoto,
        filters,
        totalCount
    } = useFilters();
    const {
        gender,
        ageRange,
        orderBy,
        withPhoto
    } = filters;
  return (
    <div className='shadow-md py-4'>
        <div className='flex flex-row justify-around items-center'>
            <div className='flex gap-2 items-center'>
                <div className='text-default font-semibold text-xl'>
                    Results: {totalCount}
                </div>
            </div>

            <div className='flex-gap-2 items-center'>
                <div>Gender : </div>
                {
                    genderList.map(
                        ({value, icon:Icon})=>(
                            <Button
                                key={value}
                                size='sm'
                                isIconOnly
                                color='default'
                                variant={
                                    gender.includes(value) ? "solid" : "light"
                                }
                                onClick={
                                    () => selectGender(value)
                                }
                            >
                                <Icon size={24}></Icon>
                            </Button>
                        )
                    )
                }
            </div>
            <div className='flex flex-row items-center gap-2 w-1/4'>
             <Slider
                label = "Age range"
                size='sm'
                maxValue={100}
                minValue={18}
                value={ageRange}
                aria-label='Age range slider'
                color='foreground'
                onChangeEnd={values=>selectAge(values as number[])}
                ></Slider>
            </div>
            <div className='flex flex-col items-center'>
                <p className='text-sm'>With photo</p>
                <Switch
                    color='default'
                    defaultSelected={true}  
                    size="sm"
                    onChange={(checked)=>
                        selectWithPhoto(checked)
                    }
                >
                </Switch>
            </div>
            <div className='w-1/4'>
                <Select
                    size='sm'
                    className="w-full"
                    label='Order by'
                    variant='bordered'
                    color='default'
                    aria-label='Order by selector'
                    selectedKeys={
                        new Set([orderBy])
                    }
                    onSelectionChange={selectOrder}
                >
                    {orderByList.map((item) => (
                    <SelectItem key={item.value} value={item.value}   className="bg-white text-foreground">
                        {item.label} {/* or item.text */}
                    </SelectItem>
                    ))}
                </Select>
            </div>
        </div>
    </div>
  )
}
