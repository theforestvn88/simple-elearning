import React, { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Mapper = {}

const Breadcrumbs = ({homePath}) => {
    const location = useLocation()

    const crumbItems = useMemo(() => {
      const crumbs = (location.pathname.split("?")[0]).split("/")
                    .filter((part) => part.length > 0)
                    .map((part) => Mapper[part] || part)

      let crumbPath = ""
      return crumbs.map((crumb, index) => {
        crumbPath += `/${crumb}`
        const crumbName = crumb[0].toUpperCase() + crumb.slice(1)

        return index == crumbs.length-1 ? (
          <span key={crumbPath}> / {crumbName}</span>
        ) : (
          <span key={crumbPath}>{" "} / <Link to={crumbPath}>{crumbName}</Link></span>
        )
      })
    }, [location.pathname])

    return (
      <div className="breadcrumbs">
        <Link to={homePath}>Home</Link>
        {crumbItems}
      </div>
    )
}

export default Breadcrumbs
