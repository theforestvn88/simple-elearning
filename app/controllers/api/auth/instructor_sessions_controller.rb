module Api
    module Auth
        class InstructorSessionsController < SessionsController
            def create
                super
                
                partner_admin = @session.user
                unless partner_admin.partner.slug == params[:identify]
                    render json: { error: 'Invalid credentials' }, status: :forbidden
                end
            end

            private
                
                def subject_clazz
                    Instructor
                end
        end
    end
end
