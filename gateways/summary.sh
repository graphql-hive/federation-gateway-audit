#!/bin/bash

# Find result files
result_files=$(ls results_*.txt)

# Initialize arrays to store gateways and their success rates
gateways=()
rates=()
successes=()
totals=()

# Process each result file
for filepath in $result_files; do
  # Extract gateway name from filename
  gateway=$(echo $filepath | cut -d'_' -f2 | cut -d'.' -f1)

  # Read the file content
  content=$(cat "$filepath")

  # Initialize success and failure counters
  success=0
  failure=0

  # Process each line in the file content
  while IFS= read -r line; do
    if [[ $line =~ ^[\.\X]+$ ]]; then
      for (( i=0; i<${#line}; i++ )); do
        char=${line:$i:1}
        if [[ $char == '.' ]]; then
          success=$((success + 1))
        elif [[ $char == 'X' ]]; then
          failure=$((failure + 1))
        fi
      done
    fi
  done <<< "$content"

  # Calculate success rate in percentage and round to nearest integer
  total=$((success + failure))
  if [[ $total -ne 0 ]]; then
    rate=$(( (100 * success + total / 2) / total ))
  else
    rate=0
  fi

  # Append gateway, rate, success, and total to arrays
  gateways+=("$gateway")
  rates+=("$rate")
  successes+=("$success")
  totals+=("$total")
done

# Initialize summary variable
table=""
summary=""
markdown_summary="
# Compatibility Results

## Summary

|  Gateway   | Compatibility | Success/Failure |
| :--------: | :-----------: | :-------------: |"

markdown_details="
## Detailed Results

Take a closer look at the results for each gateway.

Here's an example result:

\`\`\`
abstract-types
...X.X..
\`\`\`

This means that the test \`abstract-types\` failed on the 4th and 6th test case, while the rest passed.

The \`.\` symbol represents a successful test, while the \`X\` symbol represents a failed test.

You can look at the full list of tests [here](../src/test-cases/). Every test id corresponds to a directory in the \`src/test-cases\` folder.
"

# Sort the gateways by the number of successes in descending order
for ((i=0; i<${#gateways[@]}; i++)); do
  for ((j=i+1; j<${#gateways[@]}; j++)); do
    if (( ${successes[i]} < ${successes[j]} )); then
      # Swap successes
      temp=${successes[i]}
      successes[i]=${successes[j]}
      successes[j]=$temp
      # Swap rates
      temp=${rates[i]}
      rates[i]=${rates[j]}
      rates[j]=$temp
      # Swap gateways
      temp=${gateways[i]}
      gateways[i]=${gateways[j]}
      gateways[j]=$temp
      # Swap totals
      temp=${totals[i]}
      totals[i]=${totals[j]}
      totals[j]=$temp
    fi
  done
done

# Build the summary and markdown details
for ((i=0; i<${#gateways[@]}; i++)); do
  gateway=${gateways[i]}
  rate=${rates[i]}
  success=${successes[i]}
  total=${totals[i]}
  
  # Append to the summary string
  summary+="$gateway\n$rate% $success/$total"$'\n\n'

  table+="| $gateway | $rate% | $success/$total |\n"
  markdown_details+="
### $gateway

<details>
<summary>Results</summary>
"
  # Add the content with test case names as markdown links
  while IFS= read -r line; do
    if [[ $line =~ ^[.X] ]]; then
      markdown_details+="<pre>$line</pre>\n"
    else
      markdown_details+="<a href=\"../src/test-cases/$line\">$line</a>\n"
    fi
  done < "results_$gateway.txt"

  markdown_details+="
</details>
"
done

# Write summary to summary.txt
echo -e "$summary" > summary.txt
echo -e "$markdown_summary" > summary.md
echo -e "$table" >> summary.md
echo -e "$markdown_details" >> summary.md

# Update README.md with the new table

# Create a temporary file for the updated markdown content
temp_file=$(mktemp)

readme_table="
|  Gateway   | Compatibility | Success/Failure |
| :--------: | :-----------: | :-------------: |
$table
"


# Extract file content before line <!-- gateways:start -->
before_gateways=$(sed '/<!-- gateways:start -->/q' ../README.md)
# Extract fiel content after line <!-- gateways:end -->
after_gateways=$(sed -n '/<!-- gateways:end -->/,$p' ../README.md)


new_readme="$before_gateways
|  Gateway   | Compatibility | Success/Failure |
| :--------: | :-----------: | :-------------: |
$table
$after_gateways"

echo -e "$new_readme" > ../README.md