# Backlog

Future work items and improvements for the Google Maps Platform Code Assist toolkit.

## v1.0 Planned Changes

### Tool Deprecation

- [ ] **Remove `retrieve-instructions` tool** - The `retrieve-instructions` tool is deprecated in favor of the Agent Skill. For v1.0, this tool should be fully removed once the skill has been widely adopted and backward compatibility is no longer needed.
  - **Rationale**: The Agent Skill (AgentSkills.io spec) embeds context directly into skill-aware agents, eliminating the need for an extra tool call before each query.
  - **Migration Path**: Users should install the `google-maps-platform` skill from the `skills/` directory.
  - **Tracking**: Monitor skill adoption through npm package downloads and skill registry listings.

### MCP Server Updates

- [ ] **Update `retrieve-google-maps-platform-docs` description** - Remove references to requiring `retrieve-instructions` first.
- [ ] **Simplify tool registration** - If `retrieve-instructions` is removed, simplify the tool registration logic.

## Future Considerations

### v0.2 (Post-Skill Release)

- [ ] Add `scripts/` directory to skill for automated API key validation
- [ ] Create skill-specific prompts for different use cases (mobile, web, enterprise)

### v0.3+

- [ ] Explore interactive skill commands (e.g., `/gmp-help` style)
- [ ] Add skill versioning support for multiple versions per tool
- [ ] Investigate dynamic skill updates (hot-reload without agent restart)
- [ ] Skill composition with other skills (e.g., Firebase skill)

## Completed

- [x] Create Agent Skill following AgentSkills.io specification (v0.x)
- [x] Bundle skill with npm package
- [x] Document skill installation in README
