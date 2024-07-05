json.extract! user, :id, :name, :title, :introduction, :location
json.social_links user.social_links || []
json.skills []
json.certificates []
