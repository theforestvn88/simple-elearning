# frozen_string_literal: true

module Api
    module V1
        class InstructorsController < ::InstructorApiController
            before_action :authenticate!, except: [:show]
            before_action :try_authenticate, only: [:show]
            before_action :set_instructor

            def show
                try_authenticate
                authorize @instructor
            end

            def update
                authorize @instructor

                if @instructor.update(instructor_params)
                    render :show, status: :ok, location: api_v1_user_url(@instructor)
                else
                    render json: @instructor.errors, status: :unprocessable_entity
                end
            end

            def destroy
                authorize @instructor

                @instructor.destroy!
                head :ok
            end

            private

                def set_instructor
                    @instructor = ::Instructor.find(params[:id])
                end

                def instructor_params
                    permited_params = params.require(:instructor).permit(:name, :title, :location, :introduction, :avatar, :social_links => [[:id, :name, :link]])
                    info = (@instructor.info || {}).merge(permited_params.extract!(:title, :location, :social_links))
                    permited_params.merge({info: info})
                end
        end
    end
end
