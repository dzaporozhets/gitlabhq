# Discussions

The ability to contribute conversationally is offered throughout GitLab.

You can leave a comment in the following places:

- issues
- merge requests
- snippets
- commits
- commit diffs

The comment area supports [Markdown] and [quick actions]. One can edit their
own comment at any time, and anyone with [Master access level][permissions] or
higher can also edit a comment made by someone else.

Apart from the standard comments, you also have the option to create a comment
in the form of a resolvable or threaded discussion.

## Resolvable discussions

>**Notes:**
- The main feature was [introduced][ce-5022] in GitLab 8.11.
- Resolvable discussions can be added only to merge request diffs.

Discussion resolution helps keep track of progress during planning or code review.
Resolving comments prevents you from forgetting to address feedback and lets you
hide discussions that are no longer relevant.

!["A discussion between two people on a piece of code"][discussion-view]

Comments and discussions can be resolved by anyone with at least Developer
access to the project or the author of the merge request.

### Jumping between unresolved discussions

When a merge request has a large number of comments it can be difficult to track
what remains unresolved. You can jump between unresolved discussions with the
Jump button next to the Reply field on a discussion.

You can also jump to the first unresolved discussion from the button next to the
resolved discussions tracker.

!["3/4 discussions resolved"][discussions-resolved]

### Marking a comment or discussion as resolved

You can mark a discussion as resolved by clicking the **Resolve discussion**
button at the bottom of the discussion.

!["Resolve discussion" button][resolve-discussion-button]

Alternatively, you can mark each comment as resolved individually.

!["Resolve comment" button][resolve-comment-button]

### Move all unresolved discussions in a merge request to an issue

> [Introduced][ce-8266] in GitLab 9.1

To continue all open discussions from a merge request in a new issue, click the
**Resolve all discussions in new issue** button.

![Open new issue for all unresolved discussions](img/btn_new_issue_for_all_discussions.png)

Alternatively, when your project only accepts merge requests [when all discussions
are resolved](#only-allow-merge-requests-to-be-merged-if-all-discussions-are-resolved),
there will be an **open an issue to resolve them later** link in the merge
request widget.

![Link in merge request widget](img/resolve_discussion_open_issue.png)

This will prepare an issue with its content referring to the merge request and
the unresolved discussions.

![Issue mentioning discussions in a merge request](img/preview_issue_for_discussions.png)

Hitting **Submit issue** will cause all discussions to be marked as resolved and
add a note referring to the newly created issue.

![Mark discussions as resolved notice](img/resolve_discussion_issue_notice.png)

You can now proceed to merge the merge request from the UI.

### Moving a single discussion to a new issue

> [Introduced][ce-8266] in GitLab 9.1

To create a new issue for a single discussion, you can use the **Resolve this
discussion in a new issue** button.

![Create issue for discussion](img/new_issue_for_discussion.png)

This will direct you to a new issue prefilled with the content of the
discussion, similar to the issues created for delegating multiple
discussions at once. Saving the issue will mark the discussion as resolved and
add a note to the merge request discussion referencing the new issue.

![New issue for a single discussion](img/preview_issue_for_discussion.png)

### Only allow merge requests to be merged if all discussions are resolved

> [Introduced][ce-7125] in GitLab 8.14.

You can prevent merge requests from being merged until all discussions are
resolved.

Navigate to your project's settings page, select the
**Only allow merge requests to be merged if all discussions are resolved** check
box and hit **Save** for the changes to take effect.

![Only allow merge if all the discussions are resolved settings](img/only_allow_merge_if_all_discussions_are_resolved.png)

From now on, you will not be able to merge from the UI until all discussions
are resolved.

![Only allow merge if all the discussions are resolved message](img/only_allow_merge_if_all_discussions_are_resolved_msg.png)

### Automatically resolve merge request diff discussions when they become outdated

> [Introduced][ce-14053] in GitLab 10.0.

You can automatically resolve merge request diff discussions on lines modified
with a new push.

Navigate to your project's settings page, select the **Automatically resolve
merge request diffs discussions on lines changed with a push** check box and hit
**Save** for the changes to take effect.

![Automatically resolve merge request diff discussions when they become outdated](img/automatically_resolve_outdated_discussions.png)

From now on, any discussions on a diff will be resolved by default if a push
makes that diff section outdated. Discussions on lines that don't change and
top-level resolvable discussions are not automatically resolved.

## Threaded discussions

> [Introduced][ce-7527] in GitLab 9.1.

While resolvable discussions are only available to merge request diffs,
discussions can also be added without a diff. You can start a specific
discussion which will look like a thread, on issues, commits, snippets, and
merge requests.

To start a threaded discussion, click on the **Comment** button toggle dropdown,
select **Start discussion** and click **Start discussion** when you're ready to
post the comment.

![Comment type toggle](img/comment_type_toggle.gif)

This will post a comment with a single thread to allow you to discuss specific
comments in greater detail.

![Discussion comment](img/discussion_comment.png)

## Locking discussions

> [Introduced][ce-14531] in GitLab 10.1.

There might be some cases where a discussion is better off if it's locked down.
For example:

- Discussions that are several years old and the issue/merge request is closed,
  but people continue to try to resurrect the discussion.
- Discussions where someone or a group of people are trolling, are abusive, or
  in-general are causing the discussion to be unproductive.

In locked discussions, only team members can write new comments and edit the old
ones.

To lock or unlock a discussion, you need to have at least Master [permissions]:

1. Find the "Lock" section in the sidebar and click **Edit**
1. In the dialog that will appear, you can choose to turn on or turn off the
   discussion lock
1. Optionally, leave a comment to explain your reasoning behind that action

| Turn off discussion lock | Turn on discussion lock |
| :-----------: | :----------: |
| ![Turn off discussion lock](img/turn_off_lock.png) | ![Turn on discussion lock](img/turn_on_lock.png) |

Every change is indicated by a system note in the issue's or merge request's
comments.

![Discussion lock system notes](img/discussion_lock_system_notes.png)

Once an issue or merge request is locked, project members can see the indicator
in the comment area, whereas non project members can only see the information
that the discussion is locked.

| Team member | Not a member |
| :-----------: | :----------: |
| ![Comment form member](img/lock_form_member.png) | ![Comment form non-member](img/lock_form_non_member.png) |

[ce-5022]: https://gitlab.com/gitlab-org/gitlab-ce/merge_requests/5022
[ce-7125]: https://gitlab.com/gitlab-org/gitlab-ce/merge_requests/7125
[ce-7527]: https://gitlab.com/gitlab-org/gitlab-ce/merge_requests/7527
[ce-7180]: https://gitlab.com/gitlab-org/gitlab-ce/merge_requests/7180
[ce-8266]: https://gitlab.com/gitlab-org/gitlab-ce/merge_requests/8266
[ce-14053]: https://gitlab.com/gitlab-org/gitlab-ce/merge_requests/14053
[ce-14531]: https://gitlab.com/gitlab-org/gitlab-ce/merge_requests/14531
[resolve-discussion-button]: img/resolve_discussion_button.png
[resolve-comment-button]: img/resolve_comment_button.png
[discussion-view]: img/discussion_view.png
[discussions-resolved]: img/discussions_resolved.png
[markdown]: ../markdown.md
[quick actions]: ../project/quick_actions.md
[permissions]: ../permissions.md
