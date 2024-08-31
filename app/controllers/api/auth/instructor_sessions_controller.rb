module Api
    module Auth
        class InstructorSessionsController < SessionsController
            include SubjectInstructor

            def create
                super
                
                return unless @session

                unless (instructor = @session.user) && instructor.partner.slug == params[:identify]
                    render json: { error: 'Invalid credentials' }, status: :forbidden
                end
            end
        end
    end
end
