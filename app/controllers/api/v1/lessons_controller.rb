module Api
    module V1
        class LessonsController < ApiController
            def index
                @lessons = Lesson.search_by_milestone(params[:milestone_id]).short_intro
            end

            def show
                @lesson = Lesson.find(params[:id])
            end
        end
    end
end
