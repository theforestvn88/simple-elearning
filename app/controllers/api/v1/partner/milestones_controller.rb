module Api
    module V1
        module Partner
            class MilestonesController < ::PartnerApiController
                before_action :authenticate!
                before_action :set_course
                before_action :set_milestone, except: [:create]

                def create
                    @milestone = ::Milestone.new(milestone_params)
                    @milestone.course = @course
                    @milestone.instructor = current_user

                    authorize @milestone

                    if @milestone.save
                        render @milestone
                    else
                        render json: @milestone.errors, status: :unprocessable_entity
                    end
                end

                def update
                    authorize @milestone

                    unless @milestone.update(milestone_params)
                        render json: @milestone.errors, status: :unprocessable_entity
                    end
                end

                def destroy
                    authorize @milestone

                    @milestone.destroy
                end

                private

                    def set_course
                        @course = Course.find(params[:course_id])
                    end

                    def set_milestone
                        @milestone = Milestone.find(params[:id])
                    end

                    def milestone_params
                        params.require(:milestone).permit(:name, :position)
                    end

                    def policy
                        @policy ||= Pundit.policy(current_user, @milestone)
                    end
            end
        end
    end
end
