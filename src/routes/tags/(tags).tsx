import { For } from "solid-js";
import { tags } from "~/data/tags";

const Tags = () => {
	return (
		<div class="govuk-width-container govuk-!-text-break-word">
                     <a
            onClick={() => {
              history.back();
            }}
            class="govuk-back-link"
            style={{
              cursor: "pointer",
            }}
          >
            Back
          </a>
			<h1 class="govuk-heading-m">All tags:</h1>
			<ul class="govuk-list govuk-list--bullet">
				<For each={Object.values(tags)}>
					{(tag) => (
						<li class="govuk-body">
							<a class="govuk-link" href={`/tags/${tag.id}`}>
								{tag.id}
							</a>
							<span>
								{" "}
								- {tag.posts.length} Post{tag.posts.length === 1 ? "" : "s"}
							</span>
						</li>
					)}
				</For>
			</ul>
		</div>
	);
};

export default Tags;