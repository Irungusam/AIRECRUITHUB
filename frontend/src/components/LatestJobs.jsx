
import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job) || {};
  
    return (
      <div className='max-w-7xl mx-auto my-20'>
        <h1 className='text-4xl font-extrabold text-gray-800 dark:text-gray-200 mx-10'>
          <span className='text-red-600 dark:text-red-400'>Recently Posted</span> Jobs
        </h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8 mx-10'>
          {
            !allJobs || allJobs.length <= 0 
              ? <span className='text-gray-500 dark:text-gray-400 text-lg'>No Jobs Available</span>
              : allJobs.slice(0, 6).map((job) => (
                  <LatestJobCards key={job._id} job={job} />
                ))
          }
        </div>
      </div>
    );
  };
  
export default LatestJobs;
