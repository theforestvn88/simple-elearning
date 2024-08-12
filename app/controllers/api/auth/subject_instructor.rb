module Api
    module Auth
        module SubjectInstructor
            def subject_clazz
                ::Instructor
            end

            # number of Instructors far less than number of Users and they need more security
            # so setup cache-store to cache/control instructor tokens
            def cache_store
                ::TokenCacheStore.new
            end
        end
    end
end
