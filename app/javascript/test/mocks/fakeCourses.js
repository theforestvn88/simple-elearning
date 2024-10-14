export const fakeCourses = [
    {
        id: 1,
        name: 'course 1',
        summary: 'this is course 1',
        description: 'this is course 1 description',
        cover: {
            name: 'course-1-cover',
            byte_size: 0,
            url: 'course-1-cover-url'
        },
        partner: {
            id: 1,
            name: 'partner1',
            avatar: {
                name: 'partner1-avatar',
                byte_size: 0,
                url: 'partner1-avatar-url'
            }
        },
        assigned: true,
        can_edit: true,
        can_delete: true,
        assignees: [],
        milestones: [
            {
                id: 1,
                position: 1,
                name: "milestone1",
                estimated_minutes: 60,
                can_edit: true,
                can_delete: true,
                assignees: [],
                lessons: [
                    {
                        id: 1,
                        name: 'lesson 1',
                        estimated_minutes: 60,
                        can_edit: true,
                        can_delete: true,
                        assignees: [],
                    }
                ]
            },
            {
                id: 2,
                position: 2,
                name: "milestone2",
                assignees: [],
            }
        ]
    },
    {
        id: 2,
        name: 'course 2',
        summary: 'this is course 2',
        description: 'this is course 2 description',
        cover: {
            name: 'course-2-cover',
            byte_size: 0,
            url: 'course-2-cover-url'
        },
        partner: {
            id: 2,
            name: 'partner2',
            avatar: {
                name: 'partner2-avatar',
                byte_size: 0,
                url: 'partner2-avatar-url'
            }
        },
        assignees: [],
        milestones: []
    },
    {
        id: 3,
        name: 'course 3',
        summary: 'this is course 3',
        description: 'this is course 3 description',
        cover: {
            name: 'course-3-cover',
            byte_size: 0,
            url: 'course-3-cover-url'
        },
        partner: {
            id: 3,
            name: 'partner3',
            avatar: {
                name: 'partner3-avatar',
                byte_size: 0,
                url: 'partner3-avatar-url'
            }
        },
        can_edit: false,
        can_delete: false,
        assignees: [],
        milestones: [
            {
                id: 3,
                position: 1,
                name: "milestone1",
                estimated_minutes: 60,
                can_edit: true,
                can_delete: false,
                assignees: [],
                lessons: [
                    {
                        id: 30,
                        name: 'lesson 1',
                        estimated_minutes: 60,
                        can_edit: true,
                        can_delete: true,
                        assignees: [],
                    }
                ]
            }
        ]
    },
]
