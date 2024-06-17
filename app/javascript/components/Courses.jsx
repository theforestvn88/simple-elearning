import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const coursesUrl = "/api/v1/courses";
        fetch(coursesUrl)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }

                throw new Error("Something went wrong!");
            })
            .then((courses) => setCourses(courses))
            .catch(() => {});
    }, []);

    const coursesList = courses.map((course, index) => (
        <div key={index} className="col-md-6 col-lg-4">
            <div className="card mb-4">
                <Link to={`/courses/${course.id}`} className="card-body">
                    <h5 className="card-title">{course.name}</h5>
                </Link>
            </div>
        </div>
    ));

    const emptyList = (
        <div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
            <h4>
            No course!
            </h4>
        </div>
    );

    return (
        <>
            <div className="py-5">
                <main className="container">
                    <div className="text-end mb-3">
                        <Link to="/courses/new" className="btn custom-button">
                        Create New Course
                        </Link>
                    </div>
                    <div className="row">
                        {courses.length > 0 ? coursesList : emptyList}
                    </div>
                    <Link to="/" className="btn btn-link">
                        Home
                    </Link>
                </main>
            </div>
        </>
    )
};
